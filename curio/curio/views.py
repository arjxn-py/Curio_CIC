import requests

from django.conf import settings
from django.shortcuts import render

def index(request):
    search_url = 'https://www.googleapis.com/youtube/v3/search'

    params = {
        'part' : 'snippet',
        'q' : 'python',
        'key' : settings.YOUTUBE_DATA_API_KEY,
        'maxResults' : 9,
        'type' : 'video'
    }

    r = requests.get(search_url , params=params)

    results = r.json()['items']

    for result in results:
        print(result['id']['videoId'])

    return render(request, 'index.html')