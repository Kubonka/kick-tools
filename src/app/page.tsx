import { Button } from "@/components/ui/button";

export default function Home() {
  /*[Kick Webhook] Evento recibido: {
  message_id: '6a4e294f-2f09-4171-a602-24124243f8aa',
  broadcaster: {
    is_anonymous: false,
    user_id: 67641630,
    username: 'Kubonka',
    is_verified: false,
    profile_picture: '',
    channel_slug: 'kubonka',
    identity: null
  },
  sender: {
    is_anonymous: false,
    user_id: 67641630,
    username: 'Kubonka',
    is_verified: false,
    profile_picture: '',
    channel_slug: 'kubonka',
    identity: { username_color: '#BAFEA3', badges: [Array] }
  },
  content: 'Eze sos un trolazo...',
  emotes: null
}*/
  return (
    <div className="w-full h-full">
      <Button variant={"default"} className="bg-primary rounded-[8px]">
        Home
      </Button>
    </div>
  );
}
