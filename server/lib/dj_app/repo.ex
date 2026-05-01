defmodule DjApp.Repo do
  use Ecto.Repo,
    otp_app: :dj_app,
    adapter: Ecto.Adapters.Postgres
end
