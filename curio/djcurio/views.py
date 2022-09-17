from django.shortcuts import render

def translate(request):
    return render(request, 'translate.html')