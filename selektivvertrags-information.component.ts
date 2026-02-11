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

  /**
   * Formatiert ein Datum als Quartalslabel.
   * Erwartet "YYYY.MM.DD" und liefert "YYYY - Qn".
   *
   * @param {(string | undefined | null)} value Datum als String.
   * @return {*}  {string} Das Quartalslabel im Format "YYYY - Qn".
   * @memberof SelektivvertragsInformationComponent
   */
  public formatQuartalLabel(value: string | undefined | null): string {
    if (!value || typeof value !== 'string') return '';
    const m = value.match(/^(\d{4})\.(\d{2})\.\d{2}$/);
    if (!m) return value;
    const year = m[1];
    const month = parseInt(m[2], 10);
    const quarter = Math.floor((month - 1) / 3) + 1;
    return `${year} - Q${quarter}`;
  }

  /**
   * Setzt das Bezugsdatum fuer den ausgewaehlten Vertrag.
   * Erwartet ein Datum im Format "YYYY-MM-DD" (Backend-kompatibel).
   * Akzeptiert auch "YYYY.MM.DD", das nach "YYYY-MM-DD" normalisiert wird.
   *
   * @param {(string | string[] | null | undefined)} value Datumseingabe als String oder Array.
   * @return {*}  {void}
   * @memberof SelektivvertragsInformationComponent
   */
  public setDate(value: string | string[] | null | undefined): void {
    if (!value) {
      return;
    }
    const dateStr = Array.isArray(value) ? value[0] : value;
    if (typeof dateStr === 'string' && dateStr.match(/^\d{4}\.\d{2}\.\d{2}$/)) {
      this.bezugsdatum = dateStr.replace(/\./g, '-');
    } else {
      const date = new Date(dateStr as string);
      if (!isNaN(date.getTime())) {
        this.bezugsdatum = date.toISOString().slice(0, 10);
      }
    }

    this.svdInfoLaden();
  }

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

  private svdInfoLaden(): void {
    this.loadVertragsfunktionen();
  }
}
