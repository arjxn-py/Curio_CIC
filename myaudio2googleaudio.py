import speech_recognition as sr
from gtts import gTTS
import os

r = sr.Recognizer()

with sr.Microphone() as source:
    print("Speak Now!")
    audio = r.listen(source , timeout=1 , phrase_time_limit=10)
    try:
        speech_text = r.recognize_google(audio)
        # print(speech_text)
    except sr.UnknownValueError:
        print("Could Not Understand.")
    except sr.RequestError :
        print("Could not request result from Google.")

# mytext = 'Hi There, how are you? We have been waiting for you here since a very long time.'
# language = 'en'
myobj = gTTS(text=speech_text,lang='en', slow=False)
myobj.save("welcome.mp3")
os.system("welcome.mp3")