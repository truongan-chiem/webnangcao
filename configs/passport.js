const LocalStrategy = require("passport-local").Strategy;
const ggStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../app/models/user");
const download = require('../middleware/download')
module.exports = function (passport) {
  //Passport local
  passport.use(
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
        User.findOne({ "local.username": username })
          .then((user) => {
            if (!user && user == null) {
              return done(null,false,req.flash("errorLogin", "Tài khoản không tồn tại!"));
            }
            if (!user.checkPw(password)) {
              return done(null,false,req.flash("errorLogin", "Mật khẩu không trùng khớp!"));
            } else {
              return done(null, user);
            }
          })
          .catch((err) => {
            return done(err, null);
          });
      }
    )
  );
  //Google Auth
  passport.use(
    new ggStrategy(
      {
        clientID:"766394899383-042hq3v0879trkh0jps6qejb86e0gjoe.apps.googleusercontent.com",
        clientSecret: "RPZ_IGR1bE3LfwjY0kSCu5VJ",
        callbackURL: "http://localhost:3000/acc/auth/google/cb",
        passReqToCallback: true,
      },
      (req, token, accessToken, profile, done) => {
        process.nextTick(() => {
          let googleID = profile.id;
          
          //check email sinh vien
         /* extEmail = profile._json.hd;
          if (!extEmail) {
            return done(null,false,req.flash("errorLogin", "Vui lòng đăng nhập bằng tài khoản TDT!"));
          } 
          else {*/
            User.findOne({ "google.googleID": googleID })
            .then(user=>{
              if (user) {
                return done(null, user);
              } else {
                const path = __dirname.replace('configs','public/uploads/');
                download(profile._json.picture,path+googleID+'google.png',function(){
                  //Cần sửa từ bất đồng bộ thành đồng bộ
                  console.log('finish down image google');
                })
                const newUser = new User();
                newUser.google.googleID = googleID;
                newUser.name = profile._json.name;
                newUser.google.email = profile._json.email;
                newUser.google.created = Date.now();
                newUser.google.class = '';
                newUser.google.major = '';
                newUser.google.faculty = '';
                newUser.role = 'student';
                newUser.image =  googleID+'google.png';
                
                  newUser.save((err) => {
                    if (err) {
                      return done(null, err, req.flash("errorLogin", err));
                    } else {
                      setTimeout(()=>{
                        return done(null, newUser);
                      },1000)
                    }
                  });
              }
            })
            .catch(err=> {return done(err, null)})
          //}
        });
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(null, err);
      });
  });
};
