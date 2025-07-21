"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function Settings() {
  async function procesarPalabras() {
    try {
      const res = await axios.get("/api/procesar-palabras");
      if (res.data.success) {
        alert("Webhook registrado correctamente");
      } else {
        console.error("Error al registrar webhook:", res.data.error);
        alert("Error al registrar webhook");
      }
    } catch (error) {
      console.error("Error al registrar webhook:", error);
      alert("Error al registrar webhook");
    }
  }
  async function registerWebhook() {
    try {
      const res = await axios.post("/api/register-webHook");

      if (res.data.success) {
        alert("Webhook registrado correctamente");
      } else {
        console.error("Error al registrar webhook:", res.data.error);
        alert("Error al registrar webhook");
      }
    } catch (error) {
      console.error("Error al registrar webhook:", error);
      alert("Error al registrar webhook");
    }
  }
  return (
    <div className="bg-background flex flex-row gap-4 w-full h-full">
      <Button
        variant={"default"}
        className="bg-primary"
        onClick={registerWebhook}
      >
        Suscribe chat webhook
      </Button>
      <Button variant={"default"} className="bg-primary">
        Show top chatters
      </Button>
      <Button
        variant={"default"}
        className="bg-primary"
        onClick={procesarPalabras}
      >
        Procesar
      </Button>
    </div>
  );
}
