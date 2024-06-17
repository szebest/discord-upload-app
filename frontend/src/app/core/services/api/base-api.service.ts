import { HttpHeaders, HttpParams } from '@angular/common/http';

export abstract class BaseApiService {
	protected getHeaders(options?: { [name: string]: any }): HttpHeaders {
		return new HttpHeaders({
			...{ 'Content-Type': 'application/json' },
			...options,
		});
	}

	protected applyFilters(params: HttpParams, filter: any): HttpParams {
		Object.keys(filter)
			.filter((key) => filter[key] != null && filter[key] !== '')
			.forEach((key) => {
				if (typeof filter[key] === 'object') {
					filter[key].forEach((_: any, index: number) => {
						params = params.append(key, filter[key][index]);
					});
				} else {
					params = params.append(key, filter[key]);
				}
			});
		return params;
	}
}
