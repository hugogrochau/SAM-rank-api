define({ "api": [
  {
    "type": "post",
    "url": "/auth/authenticate",
    "title": "Authenticate",
    "name": "Authenticate",
    "group": "Auth",
    "description": "<p>Authenticate with the steam OpenID 2 service</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "return_url",
            "description": "<p>URL to return to after authenticating with steam</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "realm",
            "description": "<p>OpenID realm</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>URL to redirect to for steam OpenID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": success,\n  \"data\": \"https://steamcommunity.com/openid/login?...\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/auth.js",
    "groupTitle": "Auth",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Not authorized to use resource</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"Unauthorized\",\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/auth/verify/",
    "title": "Verify",
    "name": "Verify",
    "group": "Auth",
    "description": "<p>Verify if the login is valid with the steam OpenID 2 service</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "return_url",
            "description": "<p>URL to return to after authenticating with steam</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "realm",
            "description": "<p>OpenID realm</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "response_url",
            "description": "<p>url returned from Steam</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The JWT</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "playerId",
            "description": "<p>the player Id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": \"success\",\n \"data\": {\n   \"token\": \"sdifjasfsaf2skgsjg\",\n   \"playerId\": \"71837465768574657\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/auth.js",
    "groupTitle": "Auth",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Not authorized to use resource</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"Unauthorized\",\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/player/add/:platform/:id",
    "title": "Add Player",
    "name": "AddPlayer",
    "group": "Player",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"0\"",
              "\"1\"",
              "\"2\"",
              "\"steam\"",
              "\"ps4\"",
              "\"xbox\""
            ],
            "optional": false,
            "field": "platform",
            "description": "<p>Player's platform</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Player's unique id.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/player.js",
    "groupTitle": "Player",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "player",
            "description": "<p>Player data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"player\": {\n      \"id\": \"76561198013819031\",\n      \"platform\": 0,\n      \"1v1\": 1373,\n      \"1v1_games_played\": 180,\n      \"2v2\": 1409,\n      \"2v2_games_played\": 564,\n      \"3v3\": 1150,\n      \"3v3_games_played\": 520,\n      \"3v3s\": 1110,\n      \"3v3s_games_played\": 67,\n      \"last_update\": \"2017-01-15T19:59:29.858Z\",\n      \"1v1_tier\": 15,\n      \"2v2_tier\": 15,\n      \"3v3_tier\": 15,\n      \"3v3s_tier\": 15,\n      \"1v1_division\": 1,\n      \"2v2_division\": 1,\n      \"3v3_division\": 1,\n      \"3v3s_division\": 3,\n      \"name\": \"bd | Freedom\",\n      \"created_at\": 2017-01-15T19:59:29.858Z,\n      \"priority\": 2,\n      \"team_id\": null\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DuplicatePlayer",
            "description": "<p>Player is already added</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DuplicatePlayer Error-Response:",
          "content": "HTTP/1.1 409 Conflict\n{\n  \"status\": \"error\",\n  \"message\": \"DuplicatePlayer\",\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        },
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/player/me",
    "title": "Get my Player information",
    "name": "GetMyPlayer",
    "group": "Player",
    "version": "0.0.0",
    "filename": "src/routes/player.js",
    "groupTitle": "Player",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "auth_token",
            "description": "<p>The authentication token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"auth_token\": \"ljndfkdf982kdsalf89k\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "player",
            "description": "<p>Player data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"player\": {\n      \"id\": \"76561198013819031\",\n      \"platform\": 0,\n      \"1v1\": 1373,\n      \"1v1_games_played\": 180,\n      \"2v2\": 1409,\n      \"2v2_games_played\": 564,\n      \"3v3\": 1150,\n      \"3v3_games_played\": 520,\n      \"3v3s\": 1110,\n      \"3v3s_games_played\": 67,\n      \"last_update\": \"2017-01-15T19:59:29.858Z\",\n      \"1v1_tier\": 15,\n      \"2v2_tier\": 15,\n      \"3v3_tier\": 15,\n      \"3v3s_tier\": 15,\n      \"1v1_division\": 1,\n      \"2v2_division\": 1,\n      \"3v3_division\": 1,\n      \"3v3s_division\": 3,\n      \"name\": \"bd | Freedom\",\n      \"created_at\": 2017-01-15T19:59:29.858Z,\n      \"priority\": 2,\n      \"team_id\": null\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Not authorized to use resource</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>Player does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"Unauthorized\",\n}",
          "type": "json"
        },
        {
          "title": "PlayerNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"PlayerNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/player/:platform/:id",
    "title": "Get Player information",
    "name": "GetPlayer",
    "group": "Player",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"0\"",
              "\"1\"",
              "\"2\"",
              "\"steam\"",
              "\"ps4\"",
              "\"xbox\""
            ],
            "optional": false,
            "field": "platform",
            "description": "<p>Player's platform</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Player's unique id.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/player.js",
    "groupTitle": "Player",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "player",
            "description": "<p>Player data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"player\": {\n      \"id\": \"76561198013819031\",\n      \"platform\": 0,\n      \"1v1\": 1373,\n      \"1v1_games_played\": 180,\n      \"2v2\": 1409,\n      \"2v2_games_played\": 564,\n      \"3v3\": 1150,\n      \"3v3_games_played\": 520,\n      \"3v3s\": 1110,\n      \"3v3s_games_played\": 67,\n      \"last_update\": \"2017-01-15T19:59:29.858Z\",\n      \"1v1_tier\": 15,\n      \"2v2_tier\": 15,\n      \"3v3_tier\": 15,\n      \"3v3s_tier\": 15,\n      \"1v1_division\": 1,\n      \"2v2_division\": 1,\n      \"3v3_division\": 1,\n      \"3v3s_division\": 3,\n      \"name\": \"bd | Freedom\",\n      \"created_at\": 2017-01-15T19:59:29.858Z,\n      \"priority\": 2,\n      \"team_id\": null\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>Player does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "PlayerNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"PlayerNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/player/?page=x&pageSize=y",
    "title": "Get all Players",
    "name": "GetPlayers",
    "group": "Player",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Page number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pageSize",
            "description": "<p>Page size</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "players",
            "description": "<p>List of Players</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/player.js",
    "groupTitle": "Player",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/player/remove",
    "title": "Remove my Player",
    "name": "RemoveMyPlayer",
    "group": "Player",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "success",
            "description": "<p>Success message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": \"PlayerRemoved\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/player.js",
    "groupTitle": "Player",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "auth_token",
            "description": "<p>The authentication token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"auth_token\": \"ljndfkdf982kdsalf89k\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Not authorized to use resource</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>Player does not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"Unauthorized\",\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        },
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "PlayerNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"PlayerNotFound\",\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/player/remove/:platform/:id",
    "title": "Remove Player",
    "name": "RemovePlayer",
    "group": "Player",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"0\"",
              "\"1\"",
              "\"2\"",
              "\"steam\"",
              "\"ps4\"",
              "\"xbox\""
            ],
            "optional": false,
            "field": "platform",
            "description": "<p>Player's platform</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Player's unique id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "success",
            "description": "<p>Success message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": \"PlayerRemoved\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/player.js",
    "groupTitle": "Player",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>Player does not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        },
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "PlayerNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"PlayerNotFound\",\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/player/update/:platform/:id",
    "title": "Update Player information",
    "name": "UpdatePlayer",
    "group": "Player",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"name\""
            ],
            "optional": false,
            "field": "platform",
            "description": "<p>Player's platform</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "1v1",
            "description": "<p>Player's 1v1 rank.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "2v2",
            "description": "<p>Player's 2v2 rank.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "3v3",
            "description": "<p>Player's 3v3 rank.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "3v3s",
            "description": "<p>Player's 3v3s rank.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/player.js",
    "groupTitle": "Player",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "player",
            "description": "<p>Player data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"player\": {\n      \"id\": \"76561198013819031\",\n      \"platform\": 0,\n      \"1v1\": 1373,\n      \"1v1_games_played\": 180,\n      \"2v2\": 1409,\n      \"2v2_games_played\": 564,\n      \"3v3\": 1150,\n      \"3v3_games_played\": 520,\n      \"3v3s\": 1110,\n      \"3v3s_games_played\": 67,\n      \"last_update\": \"2017-01-15T19:59:29.858Z\",\n      \"1v1_tier\": 15,\n      \"2v2_tier\": 15,\n      \"3v3_tier\": 15,\n      \"3v3s_tier\": 15,\n      \"1v1_division\": 1,\n      \"2v2_division\": 1,\n      \"3v3_division\": 1,\n      \"3v3s_division\": 3,\n      \"name\": \"bd | Freedom\",\n      \"created_at\": 2017-01-15T19:59:29.858Z,\n      \"priority\": 2,\n      \"team_id\": null\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Not authorized to use resource</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>Player does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"Unauthorized\",\n}",
          "type": "json"
        },
        {
          "title": "PlayerNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"PlayerNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/team/add/player/mine/:player-platform/:player-id",
    "title": "Add Player to my Team",
    "name": "AddPlayerToMyTeam",
    "group": "Team",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"0\"",
              "\"1\"",
              "\"2\"",
              "\"steam\"",
              "\"ps4\"",
              "\"xbox\""
            ],
            "optional": false,
            "field": "playerPlatform",
            "description": "<p>Player's platform</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "playerId",
            "description": "<p>Player's unique id.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/team.js",
    "groupTitle": "Team",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "auth_token",
            "description": "<p>The authentication token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"auth_token\": \"ljndfkdf982kdsalf89k\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "player",
            "description": "<p>Player data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"player\": {\n      \"id\": \"76561198013819031\",\n      \"platform\": 0,\n      \"1v1\": 1373,\n      \"1v1_games_played\": 180,\n      \"2v2\": 1409,\n      \"2v2_games_played\": 564,\n      \"3v3\": 1150,\n      \"3v3_games_played\": 520,\n      \"3v3s\": 1110,\n      \"3v3s_games_played\": 67,\n      \"last_update\": \"2017-01-15T19:59:29.858Z\",\n      \"1v1_tier\": 15,\n      \"2v2_tier\": 15,\n      \"3v3_tier\": 15,\n      \"3v3s_tier\": 15,\n      \"1v1_division\": 1,\n      \"2v2_division\": 1,\n      \"3v3_division\": 1,\n      \"3v3s_division\": 3,\n      \"name\": \"bd | Freedom\",\n      \"created_at\": 2017-01-15T19:59:29.858Z,\n      \"priority\": 2,\n      \"team_id\": null\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>Player does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TeamNotFound",
            "description": "<p>Team does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "PlayerNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"PlayerNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "TeamNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"TeamNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/team/add/player/:id/:player-platform/:player-id",
    "title": "Add Player to Team",
    "name": "AddPlayerToTeam",
    "group": "Team",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Team's unique id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"0\"",
              "\"1\"",
              "\"2\"",
              "\"steam\"",
              "\"ps4\"",
              "\"xbox\""
            ],
            "optional": false,
            "field": "playerPlatform",
            "description": "<p>Player's platform</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "playerId",
            "description": "<p>Player's unique id.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/team.js",
    "groupTitle": "Team",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "player",
            "description": "<p>Player data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"player\": {\n      \"id\": \"76561198013819031\",\n      \"platform\": 0,\n      \"1v1\": 1373,\n      \"1v1_games_played\": 180,\n      \"2v2\": 1409,\n      \"2v2_games_played\": 564,\n      \"3v3\": 1150,\n      \"3v3_games_played\": 520,\n      \"3v3s\": 1110,\n      \"3v3s_games_played\": 67,\n      \"last_update\": \"2017-01-15T19:59:29.858Z\",\n      \"1v1_tier\": 15,\n      \"2v2_tier\": 15,\n      \"3v3_tier\": 15,\n      \"3v3s_tier\": 15,\n      \"1v1_division\": 1,\n      \"2v2_division\": 1,\n      \"3v3_division\": 1,\n      \"3v3s_division\": 3,\n      \"name\": \"bd | Freedom\",\n      \"created_at\": 2017-01-15T19:59:29.858Z,\n      \"priority\": 2,\n      \"team_id\": null\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>Player does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TeamNotFound",
            "description": "<p>Team does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "PlayerNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"PlayerNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "TeamNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"TeamNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/team/create/mine",
    "title": "Create my Team",
    "name": "CreateMyTeam",
    "group": "Team",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Team name</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/team.js",
    "groupTitle": "Team",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "auth_token",
            "description": "<p>The authentication token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"auth_token\": \"ljndfkdf982kdsalf89k\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "team",
            "description": "<p>Team data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"team\": {\n       id: 1,\n       name: 'Black Dragons',\n       image_url: null,\n       created_at: '2017-01-23T01:50:12.887Z',\n       last_update: '2017-01-23T01:50:12.887Z',\n       players: [],\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MultipleTeamError",
            "description": "<p>Trying to create more than one team</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        },
        {
          "title": "MultipleTeamError Error-Response:",
          "content": "HTTP/1.1 409 Conflict\n{\n  \"status\": \"error\",\n  \"message\": \"MultipleTeamError\",\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/team/create",
    "title": "Create Team",
    "name": "CreateTeam",
    "group": "Team",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Team name</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/team.js",
    "groupTitle": "Team",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "team",
            "description": "<p>Team data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"team\": {\n       id: 1,\n       name: 'Black Dragons',\n       image_url: null,\n       created_at: '2017-01-23T01:50:12.887Z',\n       last_update: '2017-01-23T01:50:12.887Z',\n       players: [],\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/team/mine",
    "title": "Get my Team",
    "name": "GetMyTeam",
    "group": "Team",
    "version": "0.0.0",
    "filename": "src/routes/team.js",
    "groupTitle": "Team",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "auth_token",
            "description": "<p>The authentication token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"auth_token\": \"ljndfkdf982kdsalf89k\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "team",
            "description": "<p>Team data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"team\": {\n       id: 1,\n       name: 'Black Dragons',\n       image_url: null,\n       created_at: '2017-01-23T01:50:12.887Z',\n       last_update: '2017-01-23T01:50:12.887Z',\n       players: [],\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TeamNotFound",
            "description": "<p>Team does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Not authorized to use resource</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "TeamNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"TeamNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"Unauthorized\",\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/team/:id",
    "title": "Get team information",
    "name": "GetTeam",
    "group": "Team",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Team's unique id.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/team.js",
    "groupTitle": "Team",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "team",
            "description": "<p>Team data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"team\": {\n       id: 1,\n       name: 'Black Dragons',\n       image_url: null,\n       created_at: '2017-01-23T01:50:12.887Z',\n       last_update: '2017-01-23T01:50:12.887Z',\n       players: [],\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TeamNotFound",
            "description": "<p>Team does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "TeamNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"TeamNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/team/",
    "title": "Get all Teams",
    "name": "GetTeams",
    "group": "Team",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "teams",
            "description": "<p>List of Teams</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/team.js",
    "groupTitle": "Team",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/team/remove/mine",
    "title": "Remove my Team",
    "name": "RemoveMyTeam",
    "group": "Team",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "success",
            "description": "<p>Success message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": \"TeamRemoved\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/team.js",
    "groupTitle": "Team",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "auth_token",
            "description": "<p>The authentication token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"auth_token\": \"ljndfkdf982kdsalf89k\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TeamNotFound",
            "description": "<p>Team does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Not authorized to use resource</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        },
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "TeamNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"TeamNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"Unauthorized\",\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/team/remove/player/mine/player-platform/:player-id",
    "title": "Remove Player from my Team",
    "name": "RemovePlayerFromTeam",
    "group": "Team",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"0\"",
              "\"1\"",
              "\"2\"",
              "\"steam\"",
              "\"ps4\"",
              "\"xbox\""
            ],
            "optional": false,
            "field": "playerPlatform",
            "description": "<p>Player's platform</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "playerId",
            "description": "<p>Player's unique id.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/team.js",
    "groupTitle": "Team",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "auth_token",
            "description": "<p>The authentication token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"auth_token\": \"ljndfkdf982kdsalf89k\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "player",
            "description": "<p>Player data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"player\": {\n      \"id\": \"76561198013819031\",\n      \"platform\": 0,\n      \"1v1\": 1373,\n      \"1v1_games_played\": 180,\n      \"2v2\": 1409,\n      \"2v2_games_played\": 564,\n      \"3v3\": 1150,\n      \"3v3_games_played\": 520,\n      \"3v3s\": 1110,\n      \"3v3s_games_played\": 67,\n      \"last_update\": \"2017-01-15T19:59:29.858Z\",\n      \"1v1_tier\": 15,\n      \"2v2_tier\": 15,\n      \"3v3_tier\": 15,\n      \"3v3s_tier\": 15,\n      \"1v1_division\": 1,\n      \"2v2_division\": 1,\n      \"3v3_division\": 1,\n      \"3v3s_division\": 3,\n      \"name\": \"bd | Freedom\",\n      \"created_at\": 2017-01-15T19:59:29.858Z,\n      \"priority\": 2,\n      \"team_id\": null\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>Player does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TeamNotFound",
            "description": "<p>Team does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "PlayerNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"PlayerNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "TeamNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"TeamNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/team/remove/player/:id/player-platform/:player-id",
    "title": "Remove Player from Team",
    "name": "RemovePlayerFromTeam",
    "group": "Team",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Team's unique id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"0\"",
              "\"1\"",
              "\"2\"",
              "\"steam\"",
              "\"ps4\"",
              "\"xbox\""
            ],
            "optional": false,
            "field": "playerPlatform",
            "description": "<p>Player's platform</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "playerId",
            "description": "<p>Player's unique id.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/team.js",
    "groupTitle": "Team",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "player",
            "description": "<p>Player data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"player\": {\n      \"id\": \"76561198013819031\",\n      \"platform\": 0,\n      \"1v1\": 1373,\n      \"1v1_games_played\": 180,\n      \"2v2\": 1409,\n      \"2v2_games_played\": 564,\n      \"3v3\": 1150,\n      \"3v3_games_played\": 520,\n      \"3v3s\": 1110,\n      \"3v3s_games_played\": 67,\n      \"last_update\": \"2017-01-15T19:59:29.858Z\",\n      \"1v1_tier\": 15,\n      \"2v2_tier\": 15,\n      \"3v3_tier\": 15,\n      \"3v3s_tier\": 15,\n      \"1v1_division\": 1,\n      \"2v2_division\": 1,\n      \"3v3_division\": 1,\n      \"3v3s_division\": 3,\n      \"name\": \"bd | Freedom\",\n      \"created_at\": 2017-01-15T19:59:29.858Z,\n      \"priority\": 2,\n      \"team_id\": null\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>Player does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TeamNotFound",
            "description": "<p>Team does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "PlayerNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"PlayerNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "TeamNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"TeamNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/team/remove/:id",
    "title": "Remove Team",
    "name": "RemoveTeam",
    "group": "Team",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Team's unique id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "success",
            "description": "<p>Success message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": \"TeamRemoved\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/team.js",
    "groupTitle": "Team",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TeamNotFound",
            "description": "<p>Team does not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        },
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "TeamNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"TeamNotFound\",\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/team/set/leader/mine/:platform/:id",
    "title": "Set my Team Leader",
    "name": "SetMyTeamLeader",
    "group": "Team",
    "version": "0.0.0",
    "filename": "src/routes/team.js",
    "groupTitle": "Team",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "auth_token",
            "description": "<p>The authentication token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"auth_token\": \"ljndfkdf982kdsalf89k\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "team",
            "description": "<p>Team data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"team\": {\n       id: 1,\n       name: 'Black Dragons',\n       image_url: null,\n       created_at: '2017-01-23T01:50:12.887Z',\n       last_update: '2017-01-23T01:50:12.887Z',\n       players: [],\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TeamNotFound",
            "description": "<p>Team does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Not authorized to use resource</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        },
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "TeamNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"TeamNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"Unauthorized\",\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/team/set/leader/:id/:playerPlatform/:playerId",
    "title": "Set Team Leader",
    "name": "SetTeamLeader",
    "group": "Team",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Team's unique id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"0\"",
              "\"1\"",
              "\"2\"",
              "\"steam\"",
              "\"ps4\"",
              "\"xbox\""
            ],
            "optional": false,
            "field": "playerPlatform",
            "description": "<p>Player's platform</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "playerId",
            "description": "<p>Player's unique id.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/team.js",
    "groupTitle": "Team",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "team",
            "description": "<p>Team data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"team\": {\n       id: 1,\n       name: 'Black Dragons',\n       image_url: null,\n       created_at: '2017-01-23T01:50:12.887Z',\n       last_update: '2017-01-23T01:50:12.887Z',\n       players: [],\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>Error with the application database</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputError",
            "description": "<p>Input is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TeamNotFound",
            "description": "<p>Team does not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Not authorized to use resource</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DatabaseError Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"DatabaseError\",\n  \"data\": \"DATABASE ERROR DATA\"\n}",
          "type": "json"
        },
        {
          "title": "InputError Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n  \"message\": \"InputError\",\n  \"data\": {\n    \"playerId\": {\n      \"param\": \"playerId\",\n      \"msg\": \"Invalid Steam 64 ID\",\n      \"value\": \"banana\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "TeamNotFound Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"TeamNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"status\": \"error\",\n  \"message\": \"Unauthorized\",\n}",
          "type": "json"
        }
      ]
    }
  }
] });
