import { Component } from '@angular/core';
import { SvdService } from './svd.service';

type ApiValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

interface Vertragsfunktion {
  funktionsId?: string;
  funktionsBezeichnung?: string;
}

interface VertragsfunktionenResponse {
  result: boolean;
  vertragsfunktionenliste?: Vertragsfunktion[];
  errorCode?: string;
  message?: string;
}

class ApiError extends Error {
  readonly code: string;
  readonly details?: string;

  constructor(message: string, code = 'UNKNOWN', details?: string) {
    super(message);
    this.code = code;
    this.details = details;
  }

  static fromApiResponse(
    response: Partial<VertragsfunktionenResponse>
  ): ApiError {
    const code = response.errorCode?.trim() || 'API_ERROR';
    const message =
      response.message?.trim() || 'An error occurred while loading data.';
    return new ApiError(message, code);
  }

  static invalidResponse(reason: string): ApiError {
    return new ApiError(
      'Unexpected response from server.',
      'INVALID_RESPONSE',
      reason
    );
  }

  static fromHttpError(error: unknown): ApiError {
    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      'message' in error
    ) {
      const status = String((error as { status?: number }).status ?? '');
      const message =
        String((error as { message?: string }).message ?? '').trim() ||
        'A network error occurred.';
      const code = status ? `HTTP_${status}` : 'HTTP_ERROR';
      return new ApiError(message, code);
    }

    if (error instanceof Error) {
      return new ApiError(error.message, 'UNKNOWN_ERROR');
    }

    return new ApiError('A network error occurred.', 'UNKNOWN_ERROR');
  }

  toDisplayMessage(): string {
    if (this.code && this.code !== 'UNKNOWN') {
      return `${this.message} (Code: ${this.code})`;
    }
    return this.message;
  }
}

@Component({
  selector: 'app-selektivvertrags-information',
  templateUrl: './selektivvertrags-information.component.html',
  styleUrls: ['./selektivvertrags-information.component.scss'],
})
export class SelektivvertragsInformationComponent {
  selectedVertrag?: { vertragsid?: string | number };
  bezugsdatum?: string;
  okv?: string | number | null;
  vertragsfunktionliste: Vertragsfunktion[] = [];
  errorMessage = '';

  constructor(private svdService: SvdService) {}

  loadVertragsfunktionen(): void {
    this.clearError();

    if (!this.selectedVertrag?.vertragsid || !this.bezugsdatum || !this.okv) {
      return;
    }

    this.svdService
      .getVertragsfunktionen(
        this.selectedVertrag.vertragsid,
        this.bezugsdatum,
        this.okv
      )
      .subscribe({
        next: (res) => {
          const validation = this.validateVertragsfunktionenResponse(res);
          if (!validation.ok) {
            this.handleError(validation.error);
            return;
          }
          this.vertragsfunktionliste = validation.data;
        },
        error: (err) => {
          this.handleError(ApiError.fromHttpError(err));
        },
      });
  }

  private validateVertragsfunktionenResponse(
    res: unknown
  ): ApiValidationResult<Vertragsfunktion[]> {
    if (!res || typeof res !== 'object') {
      return { ok: false, error: ApiError.invalidResponse('empty response') };
    }

    const response = res as Partial<VertragsfunktionenResponse>;
    if (typeof response.result !== 'boolean') {
      return {
        ok: false,
        error: ApiError.invalidResponse('missing result flag'),
      };
    }

    if (response.result !== true) {
      return { ok: false, error: ApiError.fromApiResponse(response) };
    }

    if (response.vertragsfunktionenliste == null) {
      return { ok: true, data: [] };
    }

    if (!Array.isArray(response.vertragsfunktionenliste)) {
      return {
        ok: false,
        error: ApiError.invalidResponse('list is not an array'),
      };
    }

    return { ok: true, data: response.vertragsfunktionenliste };
  }

  private handleError(error: ApiError): void {
    this.vertragsfunktionliste = [];
    this.errorMessage = error.toDisplayMessage();
  }

  private clearError(): void {
    this.errorMessage = '';
  }
}
