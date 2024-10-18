export type ProductInput = {
    products: { id: string; quantity: number }[]; // Update types for id and quantity
};

export const isProductArray = (input: unknown): input is ProductInput => {
    // Check if input is an object with the 'products' key
    if (typeof input !== 'object' || input === null || !('products' in input)) {
        return false;
    }

    const products = (input as ProductInput).products;

    // Check if products is an array
    if (!Array.isArray(products)) return false;

    // Validate each item in the products array
    return products.every(item => {
        return (
            typeof item === 'object' &&
            item !== null && // Ensure the item is not null
            'id' in item && // Check for 'id' property
            'quantity' in item && // Check for 'quantity' property
            typeof item.id === 'string' && // Ensure id is a string
            typeof item.quantity === 'number' // Ensure quantity is a number
        );
    });
};