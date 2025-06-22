from functools import reduce

from django.db.models import Count, Sum, F, Q, Avg
from django.http import JsonResponse
from django.views import View
from datetime import datetime
from django.utils import timezone
from tezza.models import OrderItem


class DailyAssemblyStatsView(View):
    def get(self, request):
        # Получаем параметры дат из запроса
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')

        try:
            # Парсим даты (ожидаем формат 'YYYY-MM-DD')
            # start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date() if start_date_str else None
            # end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date() if end_date_str else None

            start_date = datetime.fromtimestamp(int(start_date_str))
            end_date = datetime.fromtimestamp(int(end_date_str))

            # # Если даты не указаны, используем текущий месяц по умолчанию
            # if not start_date or not end_date:
            #     current_date = timezone.now().date()
            #     start_date = current_date.replace(day=1)
            #     end_date = current_date
        except (ValueError, TypeError):
            return JsonResponse(
                {'error': 'Invalid date format. Use timestamp'},
                status=400
            )

        # Фильтр по дате сборки
        date_filter = Q(assembled_at__gte=start_date, assembled_at__lte=end_date)

        # Агрегация данных по сборщикам
        assembler_stats = (
            OrderItem.objects
            .filter(date_filter)
            .exclude(order__assembler__isnull=True)  # Исключаем записи без сборщика
            .values('order__assembler__id', 'order__assembler__first_name', 'order__assembler__last_name')  # Группируем по сборщику
            .annotate(
                items_count=Count('id'),
                total_value=Sum('price'),
                # avg_assembly_time=Avg(F('assembled_at') - F('started_at'))  # Среднее время сборки
            ).order_by('-total_value')  # Сортировка по количеству собранных items
        )

        # Форматирование результата
        result = []
        total = reduce(lambda x, y: x + float(y['total_value']) if y['total_value'] else 0, assembler_stats, 0)
        for i in assembler_stats:
            total_value = float(i['total_value']) if i['total_value'] else 0
            percent = total_value / total * 100
            j = {
                'assembler_id': i['order__assembler__id'],
                'assembler': f"{i['order__assembler__first_name']} {i['order__assembler__last_name']}",
                'items_count': i['items_count'],
                'total_value': total_value,
                'percent': percent
            }
            result.append(j)

        return JsonResponse(result, safe=False)
