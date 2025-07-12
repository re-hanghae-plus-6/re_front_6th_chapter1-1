const eventRegistry = {};

const handleEvent = (event) => {
  const eventType = event.type;
  const handlers = eventRegistry[eventType];

  if (!handlers) return;

  for (const selector in handlers) {
    if (event.target.matches(selector) || event.target.closest(selector)) {
      handlers[selector](event);
      break;
    }
  }
};

export const initEventManager = (() => {
  let isInitialized = false;

  return () => {
    if (isInitialized) return;

    const commonEvents = ["click", "change", "input", "submit", "focus", "blur"];

    commonEvents.forEach((eventType) => {
      document.addEventListener(eventType, handleEvent, true);
    });

    isInitialized = true;
  };
})();

export const addEvent = (eventType, selector, handler) => {
  if (!eventRegistry[eventType]) {
    eventRegistry[eventType] = {};
  }

  eventRegistry[eventType][selector] = handler;

  if (Object.keys(eventRegistry[eventType]).length === 1) {
    document.addEventListener(eventType, handleEvent, true);
  }
};
