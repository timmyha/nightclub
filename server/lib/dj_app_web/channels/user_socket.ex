defmodule DjAppWeb.UserSocket do
  use Phoenix.Socket

  # This is the "Radio Tower" that routes to specific rooms
  channel "room:*", DjAppWeb.RoomChannel

  @impl true
  def connect(params, socket, _connect_info) do
    user_id = params["user_id"] || "guest_#{:rand.uniform(1000)}"
    {:ok, assign(socket, :user_id, user_id)}
  end

  @impl true
  def id(_socket), do: nil
end
