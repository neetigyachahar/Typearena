# -*- coding: utf-8 -*-

"""
Created on Tue Feb 11 16:00:00 2020
@name: Algorithm to choose best paragraph from practice mode
@author: AVINASH
"""

#saari kaam ki nhi hai dar mat
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import nltk
from nltk import word_tokenize
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
from nltk import sent_tokenize

# user defined functions
#term frequency calculation
def tf(word, parat):
    c = parat.count(word)
    return(c/len(parat))
#tokenize the para, removing stop words like 'the, is' etc..and symbols.
def tokenpara(para):
    tokenizer = RegexpTokenizer(r'\w+')
    parat = tokenizer.tokenize(para)
    stop_words = set(stopwords.words('english'))
    parat = [w for w in parat if not w in stop_words]
    return(parat)
    
# a sample representing user top mistakes
mistakes = ['open','rubbish','potter', 'watch', 'movie', 'action', 'disappoitment']

#example\
totalraces = 3210
avgac = 94.32
avgsp = 77.82

# database is index with columns : [text;totalraceswithtext; avgaccuracy for text; avg speed for text]
#calculating scores
scores = []
for i in database:
    score = 0
    for j in mistakes:
        score += (totalraces - i[1])/totalraces + i[2]/avgac + i[3]/avgsp +tf(j, tokenpara(i[0]))
    scores.append(score)
tid = scores.index(max(scores))
print("choosing index para at :" + tid)