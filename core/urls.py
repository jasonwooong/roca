from django.conf.urls import patterns, include
urlpatterns = patterns('',
    (r'^map$', 'roca.core.views.map'),
)