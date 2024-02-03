const axios = require("axios");
const ytdl = require("ytdl-core");
const ytsapi = require("yt-search");
const fbdlapi = require("@xaviabot/fb-downloader");
const { TiktokDL } = require("@tobyg74/tiktok-api-dl");
const { twitter } = require("btch-downloader");
const insta = require("@sasmeee/igdl");

async function mediaSize(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const sizeInBytes = response.data.byteLength;
    return sizeInBytes;
  } catch (error) {
    console.error('Error:', error.message);
    return -1;
  }
}

async function ytv(url) {
    try {
        if(!ytdl.validateURL(url)) return { status: false, message: "Invalid url video!" };
        
        const dataVid = await ytdl.getInfo(url);
        const sortData = dataVid.formats.filter((format) => format.hasVideo && format.hasAudio).sort((a, b) => (b.width * b.height) - (a.width * a.height));
        const fileSize = dataVid.formats.filter((format) => format.qualityLabel === sortData[0].qualityLabel).sort((a, b) => (b.width * b.height) - (a.width * a.height));
        const thumbnail = dataVid.videoDetails.thumbnails.sort((a, b) => b.width - a.width).find((thumbnail) => thumbnail.width > 1000 || thumbnail.width > 700 || thumbnail.width > 600 || thumbnail.width > 500 || thumbnail.width > 400 || thumbnail.width > 300 || thumbnail.width > 200 || thumbnail.width > 100);
        const result = { status: true, data: { videoInfo: { title: dataVid.videoDetails.title, description: dataVid.videoDetails.description, viewCount: dataVid.videoDetails.viewCount, videoId: dataVid.videoDetails.videoId }, thumbnails: thumbnail, media: sortData[0], mediaSize: fileSize[0].contentLength }};
        return result;
    } catch(err) {
        return { status: false, message: err };;
    }
}

async function yta(url) {
    try {
        if(!ytdl.validateURL(url)) return { status: false, message: "Invalid url video!" };
        
        const dataVid = await ytdl.getInfo(url);
        const sortData = dataVid.formats.filter((format) => format.hasVideo == false && format.hasAudio == true).sort((a, b) => (b.width * b.height) - (a.width * a.height));
        const thumbnail = dataVid.videoDetails.thumbnails.sort((a, b) => b.width - a.width).find((thumbnail) => thumbnail.width > 1000 || thumbnail.width > 700 || thumbnail.width > 600 || thumbnail.width > 500 || thumbnail.width > 400 || thumbnail.width > 300 || thumbnail.width > 200 || thumbnail.width > 100);
        const result = { status: true, data: { videoInfo: { title: dataVid.videoDetails.title, description: dataVid.videoDetails.description, viewCount: dataVid.videoDetails.viewCount, videoId: dataVid.videoDetails.videoId }, thumbnails: thumbnail, media: sortData[0], mediaSize: sortData[0].contentLength }};
        return result;
    } catch(err) {
        return { status: false, message: err };;
    }
}

async function yts(query) {
    if(!query) return { status: false, message: "Please input the query!" };
    try {
        const res = await ytsapi(query);
        const list = res.all.filter(v => v.type === "video") || [];
        if(list.length === 0) return { status: false, message: "Can't find data!" };
        return { status: true, data: list };
    } catch (e) {
        return { status: false, message: e };
    }
}

async function igdl(url) {
    if (!url) return { status: false, message: "Invalid url!" };
    try {
        const res = await insta(url);
        if (res.length < 1) return { status: false, message: "Invalid url instagram post!" };
        const content = await Promise.all(res.map(async (data) => {
            let size = await mediaSize(data.download_link);
            let media = {
                thumbnail: data.thumbnail_link,
                url: data.download_link,
                size
            };
            return media;
        }));
        return { status: true, mediaCount: content.length, data: content };
    } catch (e) {
        return { status: false, message: e };
    }
}

async function fbdl(url) {
    if(!url) return { status: false, message: "Invalid url!" };
    try {
        const result = await fbdlapi(url);
        const size = await mediaSize(result.hd || result.sd);
        return { status: true, data: { post: result.url,caption: result.title, thumb: result.thumbnail, video: result.hd || result.sd, size }};
    } catch (e) {
        return { status: false, message: e };
    }
}

async function fbdlv2(url) {
    if(!url) return { status: false, message: "Invalid url!" };
    try {
        const result = await axios.get(`https://vihangayt.me/download/fb?url=${url}`);
        const data = result.data.data;
        if(data === undefined) return { status: false, message: "Failed to get data!" };
        let size = await mediaSize(data.download[0].url);
        return { status: true, data: { post: url, caption: "", thumb: "https://pomf2.lain.la/f/fbv0lqzs.jpg", video: data.download[0].url, size }};
    } catch (e) {
        return { status: false, code: e.response.status, message: e.response.statusText };
    }
}

async function ttdl(url) {
    if(!url) return { status: false, message: "Invalid url!" };
    try {
        const res = await TiktokDL(url, { version: "v1" });
        if(res.result === undefined) return { status: false, message: response.message };
        let media = [];
        if(res.result.type == "video") {
            const vid = res.result.video;
            media = await Promise.all(vid.map(async (data) => {
                let size = await mediaSize(data);
                let result = {
                    size,
                    url: data
                }
                return result;
            }));
        } else {
            const img = res.result.images;
            media = await Promise.all(img.map(async (data) => {
                let size = await mediaSize(data);
                let result = {
                    size,
                    url: data
                }
                return result
            }));
        }
        const tt = res.result;;
        tt.music.size = await mediaSize(tt.music.playUrl[0]);
        const content = {
            type: tt.type,
            id: tt.id,
            createTime: tt.createTime,
            description: tt.description,
            hashtag: tt.hashtag,
            author: tt.author,
            videoDetails: tt.statistics,
            cover: tt.cover,
            dynamicCover: tt.dynamicCover,
            originCover: tt.originCover,
            music: tt.music,
            media
        }
        return { status: true, data: content };
    } catch (e) {
        console.log(e)
        return { status: false, message: e };
    }
}

async function twdl(url) {
    if(!url) return { status: false, message: "Invalid url!" };
    try {
        const result = await twitter(url);
        if((result.url[0].hd || result.url[0].sd) === undefined) return { status: false, message: "The url is invalid or the post is not a video!" };
        const size = await mediaSize(result.url[0].hd || result.url[0].sd);
        return { status: true, data: { caption: result.title, media: result.url[0].hd || result.url[0].sd, size } };
    } catch (e) {
        return { status: false, message: e };
    }
}

module.exports = {
    ytv,
    yta,
    yts,
    igdl,
    fbdl,
    fbdlv2,
    twdl,
    ttdl
}