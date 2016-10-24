--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;


--
-- Name: constants; Type: TABLE; Schema: public; Owner: samranking
--

CREATE TABLE constants (
    session_id character varying(255),
    steam_api_key character varying(255),
    xbox_api_key character varying(255),
    rocket_league_tracker_api_key character varying
);


--
-- Name: player; Type: TABLE; Schema: public
--

CREATE TABLE player (
    "1v1" integer,
    "1v1_games_played" integer,
    "2v2" integer,
    "2v2_games_played" integer,
    "3v3" integer,
    "3v3_games_played" integer,
    "3v3s" integer,
    "3v3s_games_played" integer,
    id character varying(255) NOT NULL,
    last_update timestamp without time zone,
    "1v1_tier" integer,
    "2v2_tier" integer,
    "3v3_tier" integer,
    "3v3s_tier" integer,
    "1v1_division" integer,
    "2v2_division" integer,
    "3v3_division" integer,
    "3v3s_division" integer,
    name character varying(255),
    platform smallint,
    created_at date
);


--
-- Name: player_pkey; Type: CONSTRAINT; Schema: public
--

ALTER TABLE ONLY player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

