create type user_role as enum ('user', 'admin');

create table user (
  id uuid primary key,
  username varchar(50) not null,
  email varchar(80) not null unique,
  password varchar(255) not null,
  updated_at timestamp not null default(now()),
  created_at timestamp not null default(now()),
  role user_role not null
)

create table artist (
  id uuid primary key,
  name varchar(50) not null,
  bio text not null,
  updated_at timestamp not null default(now()),
  created_at timestamp not null default(now())
)

create table album (
  id uuid primary key,
  title varchar(50) not null,
  release_date timestamp not null,
  cover_url text not null,
  updated_at timestamp not null default(now()),
  created_at timestamp not null default(now()),
  artist_id uuid,
  constraint fk_artist_id
   foreign key (artist_id)
   references artist(id)
   on delete set null
)

create table playlist (
  id uuid primary key,
  title varchar(50) not null,
  user_id uuid not null,
  updated_at timestamp not null default(now()),
  created_at timestamp not null default(now()),
  constraint fk_user_id
   foreign key (user_id)
   references user(id)
   on delete cascade
)

create table track(
  id uuid primary key,
  title varchar(50) not null,
  duration int not null,
  file_url text not null,
  updated_at timestamp not null default(now()),
  created_at timestamp not null default(now()),
  artist_id uuid,
  album_id uuid,
  constraint fk_artist_id
   foreign key (artist_id)
   references artist(id)
   on delete set null
  constraint fk_album_id
   foreign key (album_id)
   references album(id)
   on delete set null
)

create table playlist_track(
  playlist_id uuid not null,
  track_id uuid not null,
  added_at timestamp not null,
  constraint fk_playlist_id
    foreign key (playlist_id)
    references playlist(id)
  constraint fk_track_id
    foreign key (track_id)
    references track(id)
  constraint unique_playlist_track
    unique (playlist_id, track_id)
)

create table listening_history (
  id uuid primary key,
  user_id uuid not null,
  track_id uuid not null,
  played_at timestamp not null,
  constraint fk_user_id
    foreign key (user_id)
    references user(id)
    on delete cascade
  constraint fk_track_id
    foreign key (track_id)
    references track(id)
    on delete cascade
)

create table track_play_count (
  id uuid primary key,
  track_id uuid not null,
  play_count int not null default(0),
  constraint fk_track_id
    foreign key (track_id)
    references track(id)
    on delete cascade
)

create table album_play_count (
  id uuid primary key,
  album_id uuid not null,
  play_count int not null default(0),
  constraint fk_album_id
    foreign key (album_id)
    references album(id)
    on delete cascade
)

create table favorites (
  id uuid primary key,
  user_id uuid not null,
  track_id uuid not null,
  created_at timestamp not null default(now()),
  updated_at timestamp not null default(now()),
  constraint fk_user_id
    foreign key (user_id)
    references user(id)
    on delete cascade
  constraint fk_track_id
    foreign key (track_id)
    references track(id)
    on delete cascade
)
