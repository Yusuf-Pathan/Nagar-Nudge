import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import type { GeoJSONSource, Map as MapboxMap } from 'mapbox-gl';

import {
  MAP_BEARING,
  MAP_CENTER,
  MAP_PITCH,
  MAP_ZOOM,
  MAPBOX_TOKEN,
} from '../../core/constants/app.constants';
import { ComplaintStatus } from '../../core/enums/complaint-status.enum';
import { Complaint } from '../../core/models';
import { ComplaintService } from '../../core/services/complaint.service';

interface MapFeatureProps {
  id: string;
  title: string;
  status: ComplaintStatus;
  category: string;
  categoryName?: string;
  address?: string | null;
  citizen?: string | null;
  assignee?: string | null;
}

type StatusFilter = 'all' | ComplaintStatus;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapEl', { static: false }) mapEl!: ElementRef<HTMLDivElement>;

  readonly Status = ComplaintStatus;
  readonly filters: StatusFilter[] = [
    'all',
    ComplaintStatus.PENDING,
    ComplaintStatus.IN_PROGRESS,
    ComplaintStatus.RESOLVED,
    ComplaintStatus.REJECTED,
  ];

  activeFilter: StatusFilter = 'all';
  complaints: Complaint[] = [];
  loading = true;
  errorMessage = '';
  missingToken = !MAPBOX_TOKEN;
  visibleCount = 0;

  private map?: MapboxMap;
  private popup?: mapboxgl.Popup;
  private styleLoaded = false;

  constructor(
    private complaintService: ComplaintService,
    private zone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    if (this.missingToken) {
      this.loading = false;
      return;
    }

    // Map container is always in the DOM when a token exists
    this.initMap();
    this.loadComplaints();
  }

  ngOnDestroy(): void {
    this.popup?.remove();
    this.map?.remove();
    this.map = undefined;
  }

  setFilter(f: StatusFilter): void {
    this.activeFilter = f;
    this.applyFilter();
  }

  private loadComplaints(): void {
    if (this.missingToken) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.complaintService.getAll({ limit: 500 }).subscribe({
      next: ({ items }) => {
        this.complaints = items.filter(
          (c) =>
            !!c.location &&
            typeof c.location.latitude === 'number' &&
            typeof c.location.longitude === 'number',
        );
        this.loading = false;
        this.applyFilter();
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.loading = false;
      },
    });
  }

  private initMap(): void {
    if (!MAPBOX_TOKEN || this.map || !this.mapEl?.nativeElement) {
      return;
    }

    (mapboxgl as { accessToken: string }).accessToken = MAPBOX_TOKEN;

    this.zone.runOutsideAngular(() => {
      const map = new mapboxgl.Map({
        container: this.mapEl.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        pitch: MAP_PITCH,
        bearing: MAP_BEARING,
        antialias: true,
      });

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
      map.addControl(new mapboxgl.GeolocateControl({ trackUserLocation: false }), 'top-right');
      map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      map.on('load', () => {
        this.styleLoaded = true;
        this.add3dBuildings(map);
        this.addClusterSource(map);
        this.bindMapEvents(map);
        this.zone.run(() => {
          this.map = map;
          this.applyFilter();
        });
      });

      map.on('error', (e) => {
        const msg = (e?.error as Error | undefined)?.message || 'Map failed to load';
        this.zone.run(() => {
          if (!this.errorMessage) this.errorMessage = msg;
        });
      });
    });
  }

  private add3dBuildings(map: MapboxMap): void {
    if (!map.getLayer('building-3d')) {
      map.addLayer({
        id: 'building-3d',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 14,
        paint: {
          'fill-extrusion-color': '#d7e5dc',
          'fill-extrusion-height': ['coalesce', ['get', 'height'], 8],
          'fill-extrusion-base': ['coalesce', ['get', 'min_height'], 0],
          'fill-extrusion-opacity': 0.75,
        },
      });
    }
  }

  private addClusterSource(map: MapboxMap): void {
    map.addSource('complaints', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 48,
    });

    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'complaints',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#1b7a3e',
          10,
          '#0f5c2c',
          30,
          '#0a4420',
        ],
        'circle-radius': ['step', ['get', 'point_count'], 18, 10, 24, 30, 30],
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff',
      },
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'complaints',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
        'text-size': 13,
      },
      paint: { 'text-color': '#ffffff' },
    });

    // Status-colored pins (flag style)
    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'complaints',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'match',
          ['get', 'status'],
          'pending',
          '#f59e0b',
          'in_progress',
          '#3b82f6',
          'resolved',
          '#16a34a',
          'rejected',
          '#dc2626',
          '#6b7280',
        ],
        'circle-radius': 11,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff',
      },
    });

    // Halo ring for pending emphasis
    map.addLayer({
      id: 'unclustered-ring',
      type: 'circle',
      source: 'complaints',
      filter: ['==', ['get', 'status'], 'pending'],
      paint: {
        'circle-color': 'transparent',
        'circle-radius': 18,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#f59e0b',
        'circle-opacity': 0.5,
      },
    });
  }

  private bindMapEvents(map: MapboxMap): void {
    map.on('click', 'clusters', (e) => {
      const feature = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })[0];
      const props = feature?.properties as Record<string, unknown> | undefined;
      const clusterId = props?.['cluster_id'] as number | undefined;
      const source = map.getSource('complaints') as GeoJSONSource | undefined;
      if (clusterId === undefined || !source || !feature) return;

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || zoom === undefined) return;
        const geom = feature.geometry as GeoJSON.Point;
        map.easeTo({
          center: geom.coordinates as [number, number],
          zoom,
        });
      });
    });

    map.on('click', 'unclustered-point', (e) => {
      const feature = map.queryRenderedFeatures(e.point, {
        layers: ['unclustered-point'],
      })[0];
      if (!feature) return;
      const props = feature.properties as unknown as MapFeatureProps;
      this.zone.run(() => this.openPopup(map, e.lngLat, props));
    });

    map.on('mouseenter', 'clusters', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
      map.getCanvas().style.cursor = '';
    });
    map.on('mouseenter', 'unclustered-point', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'unclustered-point', () => {
      map.getCanvas().style.cursor = '';
    });
  }

  private openPopup(
    map: MapboxMap,
    lngLat: mapboxgl.LngLat,
    props: MapFeatureProps,
  ): void {
    const statusLabel = this.statusLabel(props.status);
    const html = `
      <div class="nn-map-popup">
        <div class="nn-map-popup-title">${escapeHtml(props.title)}</div>
        <div class="nn-map-popup-meta">
          <span class="nn-chip">${escapeHtml(props.categoryName || props.category)}</span>
          <span class="nn-status nn-status-${props.status}">${escapeHtml(statusLabel)}</span>
        </div>
        ${props.address ? `<p class="nn-map-popup-addr">${escapeHtml(props.address)}</p>` : ''}
        <div class="nn-map-popup-row">
          <span>${escapeHtml(props.citizen || '—')}</span>
          <span>${escapeHtml(props.assignee || 'Unassigned')}</span>
        </div>
      </div>`;

    this.popup?.remove();
    this.popup = new mapboxgl.Popup({ closeButton: true, offset: 18, maxWidth: '280px' })
      .setLngLat(lngLat)
      .setHTML(html)
      .addTo(map);
  }

  private applyFilter(): void {
    if (!this.map || !this.styleLoaded) return;

    const features = this.complaints
      .filter((c) => this.activeFilter === 'all' || c.status === this.activeFilter)
      .map((c) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [c.location!.longitude, c.location!.latitude] as [number, number],
        },
        properties: {
          id: c.id,
          title: c.title,
          status: c.status,
          category: c.category,
          categoryName: c.categoryName,
          address: c.address,
          citizen: c.user?.name ?? null,
          assignee: c.assignee?.name ?? null,
        },
      }));

    this.visibleCount = features.length;

    const source = this.map.getSource('complaints') as GeoJSONSource | undefined;
    source?.setData({ type: 'FeatureCollection', features });
  }

  private statusLabel(status: ComplaintStatus): string {
    switch (status) {
      case ComplaintStatus.PENDING:
        return 'Pending';
      case ComplaintStatus.IN_PROGRESS:
        return 'In Progress';
      case ComplaintStatus.RESOLVED:
        return 'Resolved';
      case ComplaintStatus.REJECTED:
        return 'Rejected';
      default:
        return status;
    }
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
