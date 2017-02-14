
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE FUNCTION player_sum() RETURNS trigger AS $player_sum$
    BEGIN
    NEW.sum := COALESCE(NEW."1v1", 0) + COALESCE(NEW."2v2", 0) + COALESCE(NEW."3v3", 0) + COALESCE(NEW."3v3s", 0);
    RETURN NEW;
    END;
    $player_sum$ LANGUAGE plpgsql;

    CREATE TRIGGER "player_sum"
    BEFORE INSERT OR UPDATE ON "player"
    FOR EACH ROW
    EXECUTE PROCEDURE player_sum();
  `);

};

exports.down = function(knex, Promise) {
  return knex.raw(`
    DROP TRIGGER player_sum ON "player";
    DROP FUNCTION player_sum();
  `);
};
