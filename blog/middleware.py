from mezzanine.core.models import CONTENT_STATUS_PUBLISHED
from roca.blog.models import BlogPost

class MapPageMiddleware(object):

    def process_template_response(self, request, response):
        """
        Insert map data context into response if viewing map
        page content.
        """
        MAP_TEMPLATE = "map.html"

        template = []
        for r in response.template_name:
            template.append(r.split('/')[-1])
            
        if MAP_TEMPLATE not in template:
            return response

        blog_posts = BlogPost.objects.filter(status=CONTENT_STATUS_PUBLISHED, show_map=True)
        map_data = []

        for blog in blog_posts:
            data = {
                'title': blog.title,
                'description': blog.description_from_content,
                'url': blog.get_absolute_url(),
                'latitude': blog.geo.latitude,
                'longitude': blog.geo.longitude
            }
            map_data.append(data)

        response.context_data['map_data'] = map_data

        return response