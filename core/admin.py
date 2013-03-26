from django.contrib import admin
from roca.core.models import PhotoHeader

class PhotoHeaderAdmin(admin.ModelAdmin):
	list_display = ('title', 'preview')
	
	def preview(self, obj):
		return "<a target='_blank' href='/?photo_header=%s'>Preview</a>" % obj.pk

	preview.allow_tags = True

admin.site.register(PhotoHeader, PhotoHeaderAdmin)