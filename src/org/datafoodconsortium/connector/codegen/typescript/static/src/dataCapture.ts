import { Observable } from "./Observable";

function validate(maybeUrl: any) {
  try { return new URL(maybeUrl) && true; }
  catch (_) { return false; }
}

export default function useDataCapture(exporter: Observable<string>, url: string) {
  if (validate(url)) {
    exporter.subscribe(function exportSubscriber(json: string) {
      fetch(url, { method: 'POST', body: json });
    });
  }
}
