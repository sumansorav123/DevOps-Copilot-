const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!response.ok) {
        let errorMessage = `API request failed with status ${response.status}`;

        try {
            const errorData = await response.json();

            if (errorData?.detail) {
                errorMessage =
                    typeof errorData.detail === "string"
                        ? errorData.detail
                        : JSON.stringify(errorData.detail);
            }
        } catch {
            // Keep default error message
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}