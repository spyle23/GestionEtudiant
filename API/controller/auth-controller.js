const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { headers } = require("../headers");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "gestionetudiantdb",
});

con.connect((err) => {
  if (err) throw err;
  console.log("database connected");
});
const auth = {
  register: (req, res) => {
    const datas = [];
    req
      .on("data", (donne) => {
        datas.push(donne);
      })
      .on("end", () => {
        const buffer = Buffer.concat(datas);
        const data = JSON.parse(buffer.toString("utf-8"));

        bcrypt
          .hash(data.infoPerso.mdp, 3)
          .then((mdpHash) => {
            if (!mdpHash) {
              res.writeHead(400, headers);
              res.write(JSON.stringify({ message: "erreur" }));
            }
            con.query(
              "INSERT INTO auth (nom, prenom, email, mdp, pseudo) VALUES (?, ?, ?, ?, ?)",
              [
                data.nom,
                data.prenom,
                data.mail.email,
                mdpHash,
                data.infoPerso.pseudo,
              ],
              (error, result) => {
                if (error) throw error;
                res.writeHead(200, headers);
                res.write(JSON.stringify({message: 'user created'}));
                res.end();
              }
            );
          })
          .catch((error) => console.log("erreur"));
      });
  },
  login: (req, res) => {
    const datas = [];
    req
      .on("data", (donne) => {
        datas.push(donne);
      })
      .on("end", () => {
        const buffer = Buffer.concat(datas);
        const data = JSON.parse(buffer.toString("utf-8"));

        con.query(
          "SELECT id,mdp FROM auth WHERE email = ?",
          data.email,
          (err, result) => {
            if (err) throw err;
            bcrypt
              .compare(data.mdp, result[0].mdp.toString())
              .then((value) => {
                if (!value) {
                  res.writeHead(404, headers);
                  res.write(JSON.stringify({ message: "mdp incorect" }));
                  res.end();
                }
                const response = jwt.sign(
                  { userId: result[0].id.toString() },
                  "PRIVATE KEY",
                  { expiresIn: "1m" }
                );
                res.writeHead(200, headers);
                res.write(JSON.stringify(response));
                res.end();
              })
              .catch((err) => {
                throw err;
              });
          }
        );
      });
  },
  getListe: (req, res) => {
    try {
      jwt.verify(req.rawHeaders[9].split(" ")[1], "PRIVATE KEY");
      con.query(
        "SELECT nom, prenom, email, pseudo FROM auth",
        (error, result) => {
          if (error) throw error;
          res.writeHead(200, headers);
          res.write(JSON.stringify(result));
          res.end();
        }
      );
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.writeHead(403, headers);
        res.write(JSON.stringify({ error }));
        res.end();
      }
    }
  },
  getUserById: (req, res, id) => {
    const userId = parseInt(id);
    try {
      jwt.verify(req.rawHeaders[9].split(" ")[1], "PRIVATE KEY");
      con.query(
        "SELECT nom, prenom, email, pseudo FROM auth WHERE id = ?",
        userId,
        (err, result) => {
          if (err) throw err;
          res.writeHead(200, headers);
          res.write(JSON.stringify(result));
          res.end();
        }
      );
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.writeHead(403, headers);
        res.write(JSON.stringify({ error }));
        res.end();
      }
    }
  },
};

module.exports = { auth };
