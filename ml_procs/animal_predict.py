from fastai.vision.all import *
import sys

def is_cat(x): return x[0].isupper()
learn = load_learner("export.pkl")
img = PILImage.create(sys.argv[1])
result = learn.predict(img)[1].item()

if result == 1:
    print('cat')
else:
    print('dog')
