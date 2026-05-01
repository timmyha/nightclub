defmodule DjAppWeb.RoomChannel do
  use DjAppWeb, :channel
  # Add this alias for cleaner code
  alias DjAppWeb.Presence
  alias DjApp.Rooms.RoomServer

  def join("room:" <> room_id, _payload, socket) do
    # Rooms are prestarted at app boot. Ensure the room exists.
    case Registry.lookup(DjApp.RoomRegistry, {:room, room_id}) do
      [{_pid, _}] ->
        # Trigger presence after successful join
        send(self(), :after_join)
        {:ok, %{user_id: socket.assigns.user_id}, assign(socket, :room_id, room_id)}

      [] ->
        # Reject join if the room is not configured/started
        {:error, %{reason: "room_not_found"}}
    end
  end

  def handle_info(:after_join, socket) do
    # Add a simple log to your terminal so you can see if this even runs
    IO.puts(">>> USER JOINED: #{socket.assigns.user_id}")

    case Presence.track(socket, socket.assigns.user_id, %{
           online_at: inspect(System.system_time(:second)),
           name: socket.assigns.user_id,
           color: "cyan"
         }) do
      {:ok, _} ->
        IO.puts(">>> TRACKING SUCCESS")
        push(socket, "presence_state", Presence.list(socket))

      {:error, reason} ->
        IO.puts(">>> TRACKING FAILED: #{inspect(reason)}")
    end

    {:noreply, socket}
  end

  def handle_in("join_rotation", _payload, socket) do
    RoomServer.join_rotation(socket.assigns.room_id, socket.assigns.user_id)
    {:noreply, socket}
  end

  # Broadcast player movement to other clients
  def handle_in("move", %{"x" => x, "y" => y} = payload, socket) do
    broadcast!(socket, "player_moved", %{
      id: socket.assigns.user_id,
      x: x,
      y: y,
      map: Map.get(payload, "map")
    })

    {:noreply, socket}
  end
end
