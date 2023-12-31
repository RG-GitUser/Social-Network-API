const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must match a valid email address'],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// virtual to get the length of the user's friends array
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

userSchema.methods.removeFriend = async function (friendId) {
  // remove friendId from the friends array
  this.friends = this.friends.filter(id => id.toString() !== friendId.toString());

  // save the updated user to the database
  await this.save();
};

userSchema.methods.removeUser = async function () {
  return this.model('User').findByIdAndDelete(this._id);
};


const User = model('User', userSchema);

module.exports = User;