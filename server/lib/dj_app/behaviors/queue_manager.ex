defmodule DjApp.QueueManager do
  use GenServer

  # State structure
  defstruct current_track: nil,
            # List of user_ids (The "Main Queue")
            dj_order: [],
            # %{user_id => [track1, track2]}
            user_tracks: %{}

  # --- API ---

def start_link(room_id) do
    # Pass the room_id to init so the state knows where it lives
    GenServer.start_link(__MODULE__, room_id, name: via_tuple(room_id))
  end

  def init(_room_id) do
    # You still need init to return the starting state!
    {:ok, %__MODULE__{}}
  end

  # Helper to find a specific room's process in the Registry
  defp via_tuple(room_id), do: {:via, Registry, {DjApp.RoomRegistry, room_id}}

  # --- 2. THE API (Modified to take a room_id) ---

  def add_to_queue(room_id, user_id, track) do
    # Now we send the message to the specific room's 'via_tuple'
    GenServer.call(via_tuple(room_id), {:add_track, user_id, track})
  end

  # --- 3. THE LOGIC (Stays the same!) ---

  def handle_call({:add_track, user_id, track}, _from, state) do
    new_user_tracks = Map.update(state.user_tracks, user_id, [track], fn tracks -> 
      tracks ++ [track] 
    end)
    
    new_dj_order = if user_id in state.dj_order, do: state.dj_order, else: state.dj_order ++ [user_id]

    {:reply, :ok, %{state | user_tracks: new_user_tracks, dj_order: new_dj_order}}
  end
end
