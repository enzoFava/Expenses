echo "BUILD START"
python -m install -r requirements.txt
python manage.py collecstatic --noinput --clear
echo "BUILD END"