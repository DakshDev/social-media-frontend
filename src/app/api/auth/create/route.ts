import _env from "@/config/env";
import axios, { AxiosError } from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const axios_resp = await axios.post(
      `${_env.backend_api_origin}/api/auth/create`,
      body,
      { withCredentials: true }
    );

    // ✅ Handle "set-cookie" header properly
    const setCookie = axios_resp.headers["set-cookie"];
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    if (Array.isArray(setCookie)) {
      for (const cookie of setCookie) headers.append("set-cookie", cookie);
    } else if (setCookie) { headers.set("set-cookie", setCookie) }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Created successful",
        data: axios_resp.data,
      }),
      { status: 200, headers }
    );

  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const error = err.response?.data?.error || "unknown error"
      if (err.status == 404) return new Response(JSON.stringify({ error }), { status: err.status });
      if (err.status == 400) return new Response(JSON.stringify({ error }), { status: err.status });
      return new Response(JSON.stringify({ error }), { status: err.status });
    }
    return new Response(JSON.stringify({ error: "unknown Error" }), { status: 400 });
  }
}
