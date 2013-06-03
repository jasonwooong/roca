import random

from roca.core.models import PhotoHeader
from mezzanine.conf import settings

class HeaderPhotoMiddleware(object):

    def process_template_response(self, request, response):
        try:
            photo_id = request.GET['photo_header']
            photo = PhotoHeader.objects.get(pk=photo_id)
            response.context_data['photo_header'] = photo
        except:
            photos = PhotoHeader.objects.all()
            n = photos.count()
            if n == 0:
                try:
                    default = PhotoHeader(title='', img=settings.DEFAULT_HEADER_PHOTO, href='/')
                    response.context_data['photo_header'] = default
                except:
                    return response
            else:
                rand = random.randint(0, n - 1)
                response.context_data['photo_header'] = photos[rand]
        return response