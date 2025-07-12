export class EventDelegator {
  static instance: EventDelegator | null = null;
  handlers: {
    [K in keyof HTMLElementEventMap]?: Map<string, (e: HTMLElementEventMap[K]) => void>;
  } = {};

  static getInstance() {
    if (!EventDelegator.instance) {
      EventDelegator.instance = new EventDelegator();
    }
    return EventDelegator.instance;
  }

  constructor() {}

  dispatch(type: keyof HTMLElementEventMap, e: HTMLElementEventMap[keyof HTMLElementEventMap]) {
    const target = e.target;

    if (!(target instanceof Element)) {
      return;
    }

    const handlerMap = this.handlers[type];

    if (!handlerMap) return;

    // event-id 속성값을 가진 조상을 찾음
    const matchedEntry = [...handlerMap.entries()].find(([eventId]) => target?.closest(`[event-id="${eventId}"]`));

    if (matchedEntry) {
      const [eventId, handler] = matchedEntry;
      handler(e as any);
    }
  }

  register<K extends keyof HTMLElementEventMap>(
    type: K,
    eventId: string,
    handler: (e: HTMLElementEventMap[K]) => void,
  ) {
    let eventMap = this.handlers[type];

    if (eventMap) {
      eventMap.set(eventId, handler);
      return;
    }

    eventMap = new Map();
    eventMap.set(eventId, handler);
    this.handlers[type] = eventMap;

    document.body.addEventListener(type, this.dispatch.bind(this, type));
  }

  unregister(type: keyof HTMLElementEventMap, eventId: string) {
    this.handlers[type]?.delete(eventId);
  }
}
