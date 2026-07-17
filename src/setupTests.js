// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom has no IntersectionObserver; react-intersection-observer (used for
// scroll-reveal on the Home page) needs this stubbed out in tests.
class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}

global.IntersectionObserver = IntersectionObserverStub;
