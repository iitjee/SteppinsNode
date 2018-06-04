              app.get('/item/:id', (req, res) => {
                console.log(req.params.id);
                let user = Number(req.params.id);
                console.log(user);
                console.log(mydata[user]);
                
                res.send(mydata[user]);
              });
