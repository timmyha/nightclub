defmodule DjApp.Rooms.RoomServer do
  # Rooms are part of a persistent world; always restart if they crash
  use GenServer, restart: :permanent

  # --- Client API ---

  @doc """
  Starts a room process. Called automatically by the Channel.
  """
  def start_link(room_id) do
    GenServer.start_link(__MODULE__, room_id, name: via_tuple(room_id))
  end

  @doc """
  Tells the server a user wants to enter the DJ booth.
  """
  def join_rotation(room_id, user_id) do
    GenServer.cast(via_tuple(room_id), {:join_rotation, user_id})
  end

  # --- Server Callbacks ---

  @impl true
  def init(room_id) do
    # This is the "Source of Truth" for this specific room
    {:ok, %{
      room_id: room_id,
      rotation: [],       # List of user_ids waiting to play
      current_dj: nil,    # The user currently "On Air"
      current_track: nil  # Metadata for what's playing now
    }}
  end

  @impl true
  def handle_cast({:join_rotation, user_id}, state) do
    # Add to list only if they aren't already in the rotation
    new_rotation = if Enum.member?(state.rotation, user_id),
      do: state.rotation,
      else: state.rotation ++ [user_id]

    # If nobody is DJing, make this person the active DJ immediately
    new_state = if is_nil(state.current_dj) do
      %{state | rotation: new_rotation, current_dj: user_id}
    else
      %{state | rotation: new_rotation}
    end

    # Tell the whole room the "Stage" has changed
    broadcast_state(new_state)

    {:noreply, new_state}
  end

  # --- Helpers ---

  defp broadcast_state(state) do
    DjAppWeb.Endpoint.broadcast("room:#{state.room_id}", "rotation_updated", %{
      rotation: state.rotation,
      active_dj: state.current_dj
    })
  end

  defp via_tuple(room_id) do
    # Use stable room_id as identity; names can change
    {:via, Registry, {DjApp.RoomRegistry, {:room, room_id}}}
  end
end
