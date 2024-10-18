/* eslint-disable @typescript-eslint/no-explicit-any */
export const parseJson = async (request: Request): Promise<{ data?: any; error?: string }> => {
    try {
        const jsonData = await request.json();
        return { data: jsonData }; // Return the parsed JSON data
    } catch (error) {
        console.log(error)
        return { error: 'Invalid JSON payload. Please check your input.' }; // Return an error message
    }
};
