from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 30
    max_page_size = 50
    page_size_query_param = 'page_size'