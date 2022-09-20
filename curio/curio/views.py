import requests
from isodate import parse_duration

from django.conf import settings
from django.shortcuts import render

def index(request):
    videos = []
    if request.method == 'POST':
        search_url = 'https://www.googleapis.com/youtube/v3/search'
        video_url = 'https://www.googleapis.com/youtube/v3/videos'

        search_params = {
            'part' : 'snippet',
            'q' : request.POST['search'],
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
            'id' : ','.join(video_ids),
            'maxResults' : 9,
        }

        v = requests.get(video_url,params=video_params)
        vid_results = v.json()['items']


        

        for vid_result in vid_results:
            video_data = {
                'title' : vid_result['snippet']['title'],
                'id' : vid_result['id'],
                'duration' : int(parse_duration(vid_result['contentDetails']['duration']).total_seconds() // 60),
                'thumbnail' : vid_result['snippet']['thumbnails']['high']['url']
            }
            videos.append(video_data)

    context = {
        'videos' : videos
    }

    return render(request, 'index.html' , context)