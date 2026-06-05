import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HowToPlayDialog } from "@/components/HowToPlayDialog";

describe("how to play dialog", () => {
  it("opens from the help button and closes from the dialog control", () => {
    render(<HowToPlayDialog />);

    fireEvent.click(screen.getByRole("button", { name: "How to play" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "How to play" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
