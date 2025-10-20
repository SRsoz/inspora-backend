import Post from '../models/Post.js';
import fetch from 'node-fetch';

export const getFeed = async (req, res) => {
  try {
    const { title = '', tags = '', page = 1 } = req.query;
    const limit = 25;
    const skip = (page - 1) * limit;

    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }

    const userPosts = await Post.find(filter)
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .lean();

    const formattedUserPosts = userPosts.map(p => ({
      id: p._id,
      title: p.title,
      imageUrl: p.imageUrl,
      tags: p.tags,
      user: p.userId?.username || 'Anonymous',
      source: 'user'
    }));

    const unsplashQuery = title || tags.split(',')[0] || 'inspiration';
    let unsplashImages = [];

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(unsplashQuery)}&per_page=${limit}`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
          }
        }
      );

      const data = await response.json();

      if (data.results) {
        unsplashImages = data.results.map(img => ({
          id: img.id,
          title: img.alt_description || 'Unsplash image',
          imageUrl: img.urls.small,
          user: img.user.name,
          photographerName: img.user.name,
          photographerProfile: img.user.links.html,
          unsplashLink: img.links.html,
          attribution: `Photo by ${img.user.name} on Unsplash`,
          source: 'unsplash'
        }));
      }
    } catch (unsplashError) {
      console.error('Unsplash API error:', unsplashError.message);
    }

    const combinedFeed = [...formattedUserPosts, ...unsplashImages];

    const total = combinedFeed.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedFeed = combinedFeed.slice(skip, skip + limit);

    res.status(200).json({
      page: Number(page),
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      feed: paginatedFeed
    });

  } catch (error) {
    console.error('Feed error:', error.message);
    res.status(500).json({ message: 'Something went wrong, try again later'});
  }
};
