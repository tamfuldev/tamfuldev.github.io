import { render, screen } from "@testing-library/react";

jest.mock("./configs/firebase", () => ({
    auth: {},
}));

jest.mock("firebase/auth", () => ({
    __esModule: true,
    onAuthStateChanged: (_auth, callback) => {
        callback(null);
        return () => {};
    },
}));

import App from "./App";

test("renders the portfolio hero content", () => {
    render(<App />);
    expect(screen.getByText(/i build backends/i)).toBeInTheDocument();
});
