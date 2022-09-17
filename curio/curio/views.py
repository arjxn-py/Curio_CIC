import requests

from django.conf import settings
from django.shortcuts import render

def index(request):
    search_url = 'https://www.googleapis.com/youtube/v3/search'
    video_url = 'https://www.googleapis.com/youtube/v3/videos'

    search_params = {
        'part' : 'snippet',
        'q' : 'python',
        'key' : settings.YOUTUBE_DATA_API_KEY,
        'maxResults' : 9,
        'type' : 'video'
    }

    video_ids = []

    r = requests.get(search_url , params=search_params)

    results = r.json()['items']

    for result in results:
        video_ids.append(result['id']['videoId'])

    video_params = {
        'key' : settings.YOUTUBE_DATA_API_KEY,
        'part' : 'snippet , contentDetails',
        'id' : ','.join(video_ids)
    }

    v = requests.get(video_url,params=video_params)
    vid_results = v.json()['items']

    for vid_result in vid_results:
        print(vid_result['snippet']['title'])
        print(vid_result['id'])
        print(vid_result['contentDetails']['duration'])
        print(vid_result['snippet']['thumbnails']['high']['url'])


    return render(request, 'index.html')