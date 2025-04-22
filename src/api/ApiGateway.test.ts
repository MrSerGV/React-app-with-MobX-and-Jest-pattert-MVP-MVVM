import ApiGateway from "./ApiGateway";
import ErrorStore from "../stores/ErrorStore";

jest.mock("../stores/ErrorStore", () => ({
    setError: jest.fn(),
}));

describe("ApiGateway", () => {
    const API_BASE = process.env.REACT_APP_API_BASE

    let apiGateway: ApiGateway;

    beforeEach(() => {
        jest.clearAllMocks();
        apiGateway = ApiGateway.getInstance(ErrorStore);
    });

    it("should return a singleton instance", () => {
        const instance1 = ApiGateway.getInstance(ErrorStore);
        const instance2 = ApiGateway.getInstance(ErrorStore);
        expect(instance1).toBe(instance2);
    });

    describe("_request", () => {
        beforeEach(() => {
            jest.spyOn(global, "fetch").mockClear();
        });

        const mockSuccessResponse = (data: any) => ({
            ok: true,
            json: jest.fn().mockResolvedValue(data),
        });

        const mockErrorResponse = (status: number, statusText: string) => ({
            ok: false,
            status,
            statusText,
        });

        it("should return JSON data on a successful response", async () => {
            global.fetch = jest.fn().mockResolvedValue(mockSuccessResponse({ data: "test" }));

            const result = await apiGateway["_request"]("/test");
            expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/test`, {});
            expect(result).toEqual({ data: "test" });
        });

        it("should call setError on a failed response", async () => {
            global.fetch = jest.fn().mockResolvedValue(mockErrorResponse(404, "Not Found"));

            const result = await apiGateway["_request"]("/test");
            expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/test`, {});
            expect(ErrorStore.setError).toHaveBeenCalledWith(
                "API Request Failed: HTTP Error 404: Not Found"
            );
            expect(result).toBeNull();
        });

        it("should call setError on a network error", async () => {
            global.fetch = jest.fn().mockRejectedValue(new Error("Network Error"));

            const result = await apiGateway["_request"]("/test");
            expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/test`, {});
            expect(ErrorStore.setError).toHaveBeenCalledWith("API Request Failed: Network Error");
            expect(result).toBeNull();
        });
    });

    describe("get", () => {
        it("should call _request with the correct path", async () => {
            const mockRequest = jest.spyOn(apiGateway as any, "_request").mockResolvedValue("data");
            const result = await apiGateway.get("/test");
            expect(mockRequest).toHaveBeenCalledWith("/test");
            expect(result).toBe("data");
        });
    });

    describe("post", () => {
        it("should call _request with the correct path and payload", async () => {
            const mockRequest = jest.spyOn(apiGateway as any, "_request").mockResolvedValue("data");
            const payload = { key: "value" };

            const result = await apiGateway.post("/test", payload);
            expect(mockRequest).toHaveBeenCalledWith("/test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            expect(result).toBe("data");
        });
    });
});