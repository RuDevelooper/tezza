from django.contrib.auth import logout
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response({
            "message": "success",
            'code': status.HTTP_200_OK,
            'detail': "logout success",
        })
