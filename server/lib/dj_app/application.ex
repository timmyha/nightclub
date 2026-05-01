defmodule DjApp.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    room_children =
      for room_id <- DjApp.BuildingConfig.room_ids() do
        Supervisor.child_spec(
          {DjApp.Rooms.RoomServer, room_id},
          id: {:room, room_id}
        )
      end

    children = [
      DjApp.Repo,
      DjAppWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:dj_app, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: DjApp.PubSub},

      # Registry must be up before rooms register
      {Registry, keys: :unique, name: DjApp.RoomRegistry}
    ] ++ room_children ++ [
      # Start to serve requests after rooms are ready
      DjAppWeb.Presence,
      DjAppWeb.Endpoint,
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: DjApp.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    DjAppWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
