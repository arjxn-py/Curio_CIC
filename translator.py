import speech_recognition as sr
from google_trans_new import google_translator

r = sr.Recognizer()
translator = google_translator()

with sr.Microphone() as source:
    print("Speak Now!")
    audio = r.listen(source , timeout=1 , phrase_time_limit=10)
    try:
        speech_text = r.recognize_google(audio)
        print(speech_text)
    except sr.UnknownValueError:
        print("Could Not Understand.")
    except sr.RequestError :
        print("Could not request result from Google.")

    translated_text = translator.translate(speech_text,lang_tgt='fr')
    print(translated_text)