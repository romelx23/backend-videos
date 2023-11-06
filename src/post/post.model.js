const { Schema, model } = require('mongoose')

const PostShema = Schema({
  title: {
    type: String,
    required: [true, 'title is required']
  },
  description: {
    type: String
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }],
  img: {
    required: false,
    url: {
      type: String
    },
    public_id: {
      type: String
    }
  },
  videoUrl: {
    type: String,
    required: [true, 'url is required']
  },
  // video: {
  //   url: {
  //     type: String
  //   },
  //   public_id: {
  //     type: String
  //   }
  // },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  }
},
  {
    timestamps: true,
  }
)
// Modificamos el json que nos devuelve mongoose
PostShema.methods.toJSON = function () {
  const { __v, _id, ...post } = this.toObject(); //eslint-disable-line
  post.uid = _id
  return post
}

const Post = model('Post', PostShema)
module.exports = Post
