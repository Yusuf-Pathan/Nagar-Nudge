import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface FilePreview {
  file: File;
  url: string;
  isVideo: boolean;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor, OnDestroy {
  @Input() maxFiles = 5;
  @Input() maxSizeMb = 10;

  readonly allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
  readonly acceptAttr = this.allowedTypes.join(',');

  previews: FilePreview[] = [];
  dragging = false;
  disabled = false;
  errorKey: string | null = null;

  private onChange: (files: File[]) => void = () => {};
  private onTouched: () => void = () => {};

  // ControlValueAccessor
  writeValue(files: File[] | null): void {
    // Called with [] on form reset, so previews are cleared too
    if (!files || files.length === 0) {
      this.clearPreviews();
    }
  }

  registerOnChange(fn: (files: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Events
  onFiles(list: FileList | null): void {
    if (!list || this.disabled) {
      return;
    }

    this.errorKey = null;
    const maxBytes = this.maxSizeMb * 1024 * 1024;

    Array.from(list).forEach(file => {
      if (this.previews.length >= this.maxFiles) {
        this.errorKey = 'UPLOAD.ERR_COUNT';
        return;
      }
      if (!this.allowedTypes.includes(file.type)) {
        this.errorKey = 'UPLOAD.ERR_TYPE';
        return;
      }
      if (file.size > maxBytes) {
        this.errorKey = 'UPLOAD.ERR_SIZE';
        return;
      }
      this.previews.push({
        file,
        url: URL.createObjectURL(file),
        isVideo: file.type.startsWith('video/')
      });
    });

    this.emit();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    this.onFiles(event.dataTransfer?.files ?? null);
  }

  remove(index: number): void {
    URL.revokeObjectURL(this.previews[index].url);
    this.previews.splice(index, 1);
    this.errorKey = null;
    this.emit();
  }

  ngOnDestroy(): void {
    this.clearPreviews();
  }

  private emit(): void {
    this.onChange(this.previews.map(p => p.file));
    this.onTouched();
  }

  private clearPreviews(): void {
    this.previews.forEach(p => URL.revokeObjectURL(p.url));
    this.previews = [];
  }
}
