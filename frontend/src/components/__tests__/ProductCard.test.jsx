/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../ProductCard";
import { useCartStore } from "../../stores/useCartStore";
import { useUserStore } from "../../stores/useUserStore";
import React from "react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

// Mock Lucide icons
vi.mock("lucide-react", () => ({
    Trash: () => <div data-testid="trash-icon" />,
    Star: () => <div data-testid="star-icon" />,
    Heart: () => <div data-testid="heart-icon" />,
}));

// Mock Stores
vi.mock("../../stores/useCartStore", () => ({
    useCartStore: vi.fn(),
}));
vi.mock("../../stores/useUserStore", () => ({
    useUserStore: vi.fn(),
}));
vi.mock("../../stores/useProductStore", () => ({
    useProductStore: vi.fn(() => ({
        deleteProduct: vi.fn(),
        toggleFeaturedProduct: vi.fn(),
    })),
}));

describe("ProductCard Component", () => {
    const mockProduct = {
        _id: "123",
        name: "Test Product",
        price: 99.99,
        image: "test-image.jpg",
        description: "Test description",
        stock: 10,
        sizes: [],
    };

    const mockAddToCart = vi.fn();

    beforeEach(() => {
        useCartStore.mockReturnValue({
            addToCart: mockAddToCart,
            addToWishlist: vi.fn(),
            removeFromWishlist: vi.fn(),
            wishlist: [],
        });
        useUserStore.mockReturnValue({ user: null });
    });

    afterEach(() => {
        cleanup();
    });

    it("renders product information correctly", () => {
        render(
            <MemoryRouter>
                <ProductCard product={mockProduct} />
            </MemoryRouter>,
        );

        expect(screen.getByText("Test Product")).toBeInTheDocument();
        expect(screen.getByText("$99.99")).toBeInTheDocument();
    });

    it('calls addToCart when "Add to cart" button is clicked', async () => {
        render(
            <MemoryRouter>
                <ProductCard product={mockProduct} />
            </MemoryRouter>,
        );

        const addButton = screen.getByRole("button", { name: /add to cart/i });
        fireEvent.click(addButton);

        expect(mockAddToCart).toHaveBeenCalledWith({ _id: "123" });
    });

    it('shows "Out of Stock" when stock is 0', () => {
        const outOfStockProduct = { ...mockProduct, stock: 0 };
        render(
            <MemoryRouter>
                <ProductCard product={outOfStockProduct} />
            </MemoryRouter>,
        );

        expect(screen.getByText("Out of Stock")).toBeInTheDocument();
        expect(screen.getByText("Sold Out")).toBeInTheDocument();
    });
});
