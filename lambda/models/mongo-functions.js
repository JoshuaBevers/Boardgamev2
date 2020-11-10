const MongoClient = require('mongodb').MongoClient;

const ConnectToDatabase = require('./mongo');

class Functions {
  static async claimAchievement(gameID, achievementID, user) {
    console.log('hello, this is claimAchievement!!');
    try {
      const client = await ConnectToDatabase();
      const collection = client
        .db('UserAchievements')
        .collection('Achievements');
      // perform actions on the collection object
      const insert = await collection.insertOne({
        boardgameID: gameID,
        gameAchievementID: achievementID,
        User: user,
      });
      // return status okay object. to be done.
    } catch (e) {
      console.log('the try in claimAchievement has failed.');
      return e;
    }
  }

  static async getUserAchievements(gameID, user) {
    console.log(
      'Hello, this is function should be grabbing the user achievements',
    );
    try {
      const client = await ConnectToDatabase();
      const collection = client
        .db('UserAchievements')
        .collection('Achievements');
      // perform actions on the collection object
      const query = await collection.find({
        $or: [{ boardgameID: gameID }, { User: user }],
      });
      const queryParse = await query.toArray();
      console.log('query parse is: ', queryParse);
      return queryParse;
    } catch (e) {
      console.log('the try in claimAchievement has failed.');
      return e;
    }
  }

  static async unclaimAchievement(gameID, achievementID, user) {
    console.log(
      'Hello, this is function should be removing the achievement from the user achievements',
    );
    try {
      const client = await ConnectToDatabase();
      const collection = client
        .db('UserAchievements')
        .collection('Achievements');
      // perform actions on the collection object
      const query = await collection.deleteOne({
        $or: [
          { boardgameID: gameID },
          { gameAchievementID: achievementID },
          { User: user },
        ],
      });
      const queryParse = await query.toArray();
      console.log('query parse is: ', queryParse);
    } catch (e) {
      console.log('the try in unclaimAchievement has failed.');
      console.log(e);
      return e;
    }
  }
}

module.exports = Functions;
