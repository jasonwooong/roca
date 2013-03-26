from django.db import models

# Create your models here.

class PhotoHeader(models.Model):
	"""
	Default template will display a large photo as header
	on top of every page.  The header will be selected based
	off what images are supplied using this model. 
	"""
	title = models.CharField(max_length=255)
	img = models.CharField(max_length=255, verbose_name="Image source")
	href = models.CharField(max_length=255, verbose_name="Destination URL")
	order = models.IntegerField(blank=True, null=True)


	def __unicode__(self):
		return self.title